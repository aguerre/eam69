<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Form\Model\Contact;
use EAM\DefaultBundle\Form\Type\ContactType;

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/contact")
     * @Template()
     */
    public function contactAction()
    {
        $model = new Contact();
        $type = new ContactType();

        $form = $this->get('form.factory')->create($type, $model);

    	return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route("/albums")
     * @Template()
     */
    public function albumsAction()
    {
        $albums = $this->getDoctrine()->getRepository('EAMDefaultBundle:Album')->findAll();

        return array(
            'albums' => $albums
        );
    }


    /**
     * @Route("/album-{id}", requirements={"id"="\d+"})
     * @Method({"GET"})
     * @Template
     */
    public function albumAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }

        return array(
            'album' => $album
        );
    }
}
